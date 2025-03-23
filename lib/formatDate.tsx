const formatDateField = (date?: string) => {
  if (!date) return "N/A";

  try {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      return "Date invalide";
    }

    return dateObj.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "Erreur de date";
  }
};

export { formatDateField };
