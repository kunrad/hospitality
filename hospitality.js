function hasOverstayedBy(expectedCheckout, actualCheckout) {
  const oneHour = 1000 * 60 * 60;

  if (expectedCheckout.valueOf() >= actualCheckout.valueOf()) {
    return 0;
  }

  const diff = actualCheckout.valueOf() - expectedCheckout.valueOf();

  return Math.ceil(diff / oneHour);
}

function isWeekend (date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

function calculator(db) {
  return {
    calculateOverstay: (reservationId, date) => {
      const reservation = db.reservations(reservationId);
      const hasOverstayedBy = hospitality.hasOverstayedBy(
        reservation.expectedCheckout,
        date
      );
      if (hasOverstayedBy === 0) {
        return parseInt(reservation.hourlyRate, 10);
      }

      let index = 0;
      const roomRates = db.roomOverstayRate(reservation.roomType);
      const oneHour = 1000 * 60 * 60;
      let total = 0;

      while (index < hasOverstayedBy) {
        const currentHour = index * oneHour;
        const rateType = isWeekend(new Date(date.valueOf() + currentHour)) ? 'weekend' : 'weekday';
        const rate = ((roomRates.rates[rateType] / 100) * reservation.hourlyRate) + reservation.hourlyRate;
        total = total + rate;
        index++;
      }
      return total;
    }
  };
}

export const hospitality = {
  hasOverstayedBy,
  calculator,
  isWeekend
};
