#![cfg_attr(not(feature = "std"), no_std)]



pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
	use frame_support::{
		pallet_prelude::*,
		traits::{tokens::ExistenceRequirement, Currency, Randomness},
	};
	use frame_system::pallet_prelude::*;
	use scale_info::TypeInfo;
	use sp_io::hashing::blake2_128;
	use sp_runtime::ArithmeticError;

	#[cfg(feature = "std")]
	use frame_support::serde::{Deserialize, Serialize};
	use sp_std::convert::TryInto;

	// Handles our pallet's currency abstraction
	type BalanceOf<T> =
		<<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

	// Struct for holding course information
	#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
	#[scale_info(skip_type_params(T))]
	#[codec(mel_bound())] 
	pub struct Course<T: Config> {
		// Using 16 bytes to represent a course unique slug
		pub slug: [u8; 16],
		// `None` assumes not for sale
		pub price: Option<BalanceOf<T>>,
		pub owner: T::AccountId,
	}

	#[pallet::pallet]
	#[pallet::generate_store(pub(super) trait Store)]
	pub struct Pallet<T>(_);

	// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
	pub trait Config: frame_system::Config {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;

		/// The Currency handler for the kitties pallet.
		type Currency: Currency<Self::AccountId>;

		/// The maximum amount of kitties a single account can own.
		#[pallet::constant]
		type MaxKittiesOwned: Get<u32>;

		/// The type of Randomness we want to specify for this pallet.
		type KittyRandomness: Randomness<Self::Hash, Self::BlockNumber>;
	}

	// Errors
	#[pallet::error]
	pub enum Error<T> {
		/// An account may only own `MaxKittiesOwned` kitties.
		TooManyOwned,
		/// Trying to transfer or buy a kitty from oneself.
		TransferToSelf,
		/// This kitty already exists!
		DuplicateCourse,
		/// This course does not exist!
		NoCourse,
		/// You are not the owner of this course.
		NotOwner,
		/// This kitty is not for sale.
		NotForSale,
		/// Ensures that the buying price is greater than the asking price.
		BidPriceTooLow,
		/// You need to have two cats with different gender to breed.
		CantBreed,
	}

	// Events
	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// A new kitty was successfully created.
		Created { course: [u8; 16], owner: T::AccountId },
		/// The price of a kitty was successfully set.
		PriceSet { course: [u8; 16], price: Option<BalanceOf<T>> },
		/// A kitty was successfully transferred.
		Transferred { from: T::AccountId, to: T::AccountId, course: [u8; 16] },
		/// A kitty was successfully sold.
		Sold { seller: T::AccountId, buyer: T::AccountId, course: [u8; 16], price: BalanceOf<T> },
	}

	/// Keeps track of the number of kitties in existence.
	#[pallet::storage]
	pub(super) type CountForKitties<T: Config> = StorageValue<_, u64, ValueQuery>;

	/// Maps the course struct to the courses DNA.
	#[pallet::storage]
	pub(super) type Courses<T: Config> = StorageMap<_, Twox64Concat, [u8; 16], Course<T>>;

	/// Track the kitties owned by each account.
	#[pallet::storage]
	pub(super) type KittiesOwned<T: Config> = StorageMap<
		_,
		Twox64Concat,
		T::AccountId,
		BoundedVec<[u8; 16], T::MaxKittiesOwned>,
		ValueQuery,
	>;

	// Our pallet's genesis configuration
	#[pallet::genesis_config]
	pub struct GenesisConfig<T: Config> {
		pub kitties: Vec<(T::AccountId, [u8; 16])>,
	}

	// Required to implement default for GenesisConfig
	#[cfg(feature = "std")]
	impl<T: Config> Default for GenesisConfig<T> {
		fn default() -> GenesisConfig<T> {
			GenesisConfig { kitties: vec![] }
		}
	}

	#[pallet::genesis_build]
	impl<T: Config> GenesisBuild<T> for GenesisConfig<T> {
		fn build(&self) {
			// When building a kitty from genesis config, we require the DNA and Gender to be
			// supplied
			for (account, dna) in &self.kitties {
				assert!(Pallet::<T>::mint(account, *dna).is_ok());
			}
		}
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		/// Create a new unique kitty.
		///
		/// The actual kitty creation is done in the `mint()` function.
		#[pallet::weight(0)]
		pub fn create_course(origin: OriginFor<T>) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let sender = ensure_signed(origin)?;

			// Generate unique DNA and Gender using a helper function
			let course_gen_dna = Self::gen_dna();

			// Write new kitty to storage by calling helper function
			Self::mint(&sender, course_gen_dna)?;

			Ok(())
		}



		/// Directly transfer a kitty to another recipient.
		///
		/// Any account that holds a kitty can send it to another Account. This will reset the
		/// asking price of the kitty, marking it not for sale.
		


		// #[pallet::weight(0)]
		// pub fn transfer(
		// 	origin: OriginFor<T>,
		// 	to: T::AccountId,
		// 	kitty_id: [u8; 16],
		// ) -> DispatchResult {
		// 	// Make sure the caller is from a signed origin
		// 	let from = ensure_signed(origin)?;
		// 	let kitty = Kitties::<T>::get(&kitty_id).ok_or(Error::<T>::NoKitty)?;
		// 	ensure!(kitty.owner == from, Error::<T>::NotOwner);
		// 	Self::do_transfer(kitty_id, to, None)?;
		// 	Ok(())
		// }




		/// Buy a kitty for sale. The `limit_price` parameter is set as a safeguard against the 
		/// possibility that the seller front-runs the transaction by setting a high price. A front-end
		/// should assume that this value is always equal to the actual price of the kitty. The buyer 
		/// will always be charged the actual price of the kitty.
		///
		/// If successful, this dispatchable will reset the price of the kitty to `None`, making 
		/// it no longer for sale and handle the balance and kitty transfer between the buyer and seller.
		#[pallet::weight(0)]
		pub fn buy_kitty(
			origin: OriginFor<T>,
			kitty_id: [u8; 16],
			limit_price: BalanceOf<T>,
		) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let buyer = ensure_signed(origin)?;
			// Transfer the kitty from seller to buyer as a sale
			Self::do_transfer(kitty_id, buyer, Some(limit_price))?;

			Ok(())
		}

		/// Set the price for a Course.
		///
		/// Updates course price and updates storage.
		#[pallet::weight(0)]
		pub fn set_price(
			origin: OriginFor<T>,
			course_id: [u8; 16],
			new_price: Option<BalanceOf<T>>,
		) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let sender = ensure_signed(origin)?;

			// Ensure the kitty exists and is called by the kitty owner
			let mut course = Courses::<T>::get(&course_id).ok_or(Error::<T>::NoCourse)?;
			ensure!(course.owner == sender, Error::<T>::NotOwner);

			// Set the price in storage
			course.price = new_price;
			Courses::<T>::insert(&course_id, course);

			// Deposit a "PriceSet" event.
			Self::deposit_event(Event::PriceSet { course: course_id, price: new_price });

			Ok(())
		}

	}

	//** Our helper functions.**//

	impl<T: Config> Pallet<T> {

		// Helper to mint a course
		pub fn mint(
			owner: &T::AccountId,
			slug: [u8; 16],
		) -> Result<[u8; 16], DispatchError> {
			// Create a new object
			let course = Course::<T> { slug, price: None, owner: owner.clone() };

			// Check if the kitty does not already exist in our storage map
			ensure!(!Courses::<T>::contains_key(&course.slug), Error::<T>::DuplicateCourse);

			// Performs this operation first as it may fail
			let count = CountForKitties::<T>::get();
			let new_count = count.checked_add(1).ok_or(ArithmeticError::Overflow)?;

			// Append kitty to KittiesOwned
			KittiesOwned::<T>::try_append(&owner, course.slug)
				.map_err(|_| Error::<T>::TooManyOwned)?;

			// Write new kitty to storage
			Courses::<T>::insert(course.slug, course);
			CountForKitties::<T>::put(new_count);

			// Deposit our "Created" event.
			Self::deposit_event(Event::Created { course: slug, owner: owner.clone() });

			// Returns the slug of the new course if this succeeds
			Ok(slug)
		}

		// Update storage to transfer kitty
		pub fn do_transfer(
			course_id: [u8; 16],
			to: T::AccountId,
			maybe_limit_price: Option<BalanceOf<T>>,
		) -> DispatchResult {
			// Get the course
			let mut course = Courses::<T>::get(&course_id).ok_or(Error::<T>::NoCourse)?;
			let from = course.owner;

			ensure!(from != to, Error::<T>::TransferToSelf);
			let mut from_owned = KittiesOwned::<T>::get(&from);

			// Remove kitty from list of owned kitties.
			if let Some(ind) = from_owned.iter().position(|&id| id == course_id) {
				from_owned.swap_remove(ind);
			} else {
				return Err(Error::<T>::NoCourse.into());
			}

			// Add kitty to the list of owned kitties.
			let mut to_owned = KittiesOwned::<T>::get(&to);
			to_owned.try_push(course_id).map_err(|()| Error::<T>::TooManyOwned)?;

			// Mutating state here via a balance transfer, so nothing is allowed to fail after this.
			// The buyer will always be charged the actual price. The limit_price parameter is just a 
			// protection so the seller isn't able to front-run the transaction.
			if let Some(limit_price) = maybe_limit_price {
				// Current kitty price if for sale
				if let Some(price) = course.price {
					ensure!(limit_price >= price, Error::<T>::BidPriceTooLow);
					// Transfer the amount from buyer to seller
					T::Currency::transfer(&to, &from, price, ExistenceRequirement::KeepAlive)?;
					// Deposit sold event
					Self::deposit_event(Event::Sold {
						seller: from.clone(),
						buyer: to.clone(),
						course: course_id,
						price,
					});
				} else {
					// Kitty price is set to `None` and is not for sale
					return Err(Error::<T>::NotForSale.into());
				}
			}

			// Transfer succeeded, update the kitty owner and reset the price to `None`.
			course.owner = to.clone();
			course.price = None;

			// Write updates to storage
			Courses::<T>::insert(&course_id, course);
			KittiesOwned::<T>::insert(&to, to_owned);
			KittiesOwned::<T>::insert(&from, from_owned);

			Self::deposit_event(Event::Transferred { from, to, course: course_id });

			Ok(())
		}

		// Generates and returns DNA and Gender
		pub fn gen_dna() -> ([u8; 16]) {
			// Create randomness
			let random = T::KittyRandomness::random(&b"dna"[..]).0;

			// Create randomness payload. Multiple kitties can be generated in the same block,
			// retaining uniqueness.
			let unique_payload = (
				random,
				frame_system::Pallet::<T>::extrinsic_index().unwrap_or_default(),
				frame_system::Pallet::<T>::block_number(),
			);

			// Turns into a byte array
			let encoded_payload = unique_payload.encode();
			let hash = blake2_128(&encoded_payload);

			hash
		}

		

	}
}

