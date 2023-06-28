export const colorPicker = (rating: number, normValue: number) => {
  switch (rating / normValue) {
    case 0:
      return '#F70000';
    case normValue:
      return '#1db224';
    default:
      return '#F2CD5D'
  }
}
