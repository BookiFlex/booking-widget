export default {
  en: {
    accommodationRules: {
      title: 'Accommodation rules',
      agreementSentence: 'I confirm that I have read and agree with',
      agreementSentenceShort: 'I confirm that',
    },
    accommodationType: {
      thumbnail: 'Thumbnail',
      notAvailable: {
        title: 'Oops! Looks like this accommodation type is fully booked for the selected dates.',
        description: 'Feel free to try different dates or explore other available options — we’re sure you’ll find something perfect!'
      },
    },
    chosenAccommodation: {
      title: 'Accommodations',
      adults: '{n} adult | {n} adults',
      children: '{n} child | {n} children',
      willPay: 'I will pay by',
      totalAmount: 'Total amount',
      prepaymentAmount: 'Pay now',
      onArrivalAmount: 'Amount to be paid on arrival',
      delete: 'Delete',
      penalty: 'Cancellation Penalty',
    },
    contactInformation: {
      title: 'Contact Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phoneNumber: 'Phone number',
      confirmationInfo:
        'You will receive a booking confirmation by email. The owner of the place may contact you by phone to clarify the details.',
    },
    customerRequest: {
      title: 'Customer request',
      comment: 'Comment',
      checkInOutTime: 'Check-in/out Time',
      checkInTimeFrom: 'Check-in time from',
      checkOutTimeUntil: 'Check-out time until',
      arrivalTime: 'Your arrival time',
      noneTime: 'I do not know',
    },
    globalError: {
      title: 'Sorry, something went wrong',
      description: "We couldn't load the data. Please try refreshing the page or come back later.",
      reload: 'Reload',
    },
    price: {
      free: 'Free',
    },
    ratePlan: {
      payments: 'Payments',
      or: 'OR',
      los: '{n} night | {n} nights',
      action: 'Book now',
      boardType: {
        ROOM_ONLY: 'Room Only',
        BREAKFAST: 'Breakfast',
        HALF_BOARD: 'Half Board',
        FULL_BOARD: 'Full Board',
        ALL_INCLUSIVE: 'All Inclusive',
        BUFFET_BREAKFAST: 'Buffet Breakfast',
        CARIBBEAN_BREAKFAST: 'Caribbean Breakfast',
        CONTINENTAL_BREAKFAST: 'Continental Breakfast',
        ENGLISH_BREAKFAST: 'English Breakfast',
        FULL_BREAKFAST: 'Full Breakfast',
        DINNER_BED_AND_BREAKFAST: 'Dinner Bed And Breakfast',
        LUNCH: 'Lunch',
        DINNER: 'Dinner',
        FAMILY_PLAN: 'Family Plan',
        AS_BROCHURED: 'As Brochured',
        SELF_CATERING: 'Self Catering',
        BERMUDA: 'Bermuda',
        AMERICAN: 'American',
        FAMILY_AMERICAN: 'Family American',
        MODIFIED: 'Modified',
      },
      scenario: {
        mainBeds: 'Main bed(s)',
        extraBeds: 'Extra bed(s)',
        family: 'Adults + children',
        mainExtraBeds: 'Main bed(s) + Extra bed(s)',
      },
    },
    cancellationPolicy: {
      free: 'Free cancellation',
      paid: 'Paid cancellation',
      beforeFree: 'Free cancellation is possible before {date}',
      afterPenaltyStart: 'If the cancellation is made after {date}, a penalty of ',
      penalty: {
        days: '{days} days of the booking cost',
        fixed: '{fixedPenalty}',
        percent: '{penaltyPercentage}% of the booking cost',
        percentAndFixed: '{penaltyPercentage}% of the booking cost + {fixedPenalty}',
        daysAndFixed: '{days} days of the booking cost + {fixedPenalty}',
      },
    },
    cancellationProcess: {
      title: 'Cancel your reservation',
      description: 'На этой странице вы сможете отменить вашу резервацию',
      rules: 'Rules of cancellation',
      codeHelp: 'Get a cancellation code from your reservation email',
      codeLabel: 'Cancellation code',
      action: 'Cancel reservation',
      result: {
        success: 'Your reservation has been cancelled',
        error: 'Problem with cancellation your reservation. Check your cancellation code. If code is valid please contact the administrator.',
      },
    },
    summary: {
      complete: 'Book Now',
      room: '{n} room | {n} rooms',
      los: '@:ratePlan.los',
    },
    reservation: {
      title: 'Your booking is complete!',
      description: {
        waitingPayment: 'Please make a prepayment to confirm your booking.',
        waitingConfirmation: 'We will try to confirm your booking as soon as possible.',
        confirmed: 'Your booking has been successfully confirmed.',
        cancelled: 'Your booking has been cancelled.',
        overdue: 'The payment time for your booking has expired. It will be cancelled soon.'
      },
      nextStep: {
        waitingPayment: 'You can pay now to secure your reservation. We’ll hold it for a limited time {untilTime} — if no payment is received, it may be automatically cancelled.',
        waitingConfirmation: 'We’re checking availability and will notify you once your booking is confirmed. Please wait — this usually takes no more than 24 hours.',
        confirmed: 'Thank you for your reservation! You’ll receive a confirmation email with all details shortly. If you have any questions, feel free to contact us.',
        cancelled: 'Unfortunately, this booking is no longer valid. If you still wish to travel, please make a new reservation.',
        overdue: 'If you still want to keep your booking, please contact us as soon as possible. Otherwise, it will be automatically cancelled.'
      },
      whatIsNext: 'What is your next step?',
      customerRequest: 'Your request',
      hotelInfo: {
        title: 'Contact Information',
        email: 'Email',
      },
      payment: {
        action: 'Pay Now',
        prepayment: 'Prepayment',
      }
    },
  },
}
