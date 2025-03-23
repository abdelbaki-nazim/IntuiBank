export const civilityToEnglish = (civility: string): string => {
  switch (civility.toUpperCase()) {
    case "MR":
      return "Mr.";
    case "MRS":
      return "Mrs.";
    case "MS":
      return "Ms.";
    case "MISS":
      return "Miss";
    case "DR":
      return "Dr.";
    case "PROF":
      return "Prof.";
    case "MAITRE":
      return "Master";
    default:
      return civility;
  }
};
