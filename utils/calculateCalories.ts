interface UserData {
    gender: "masculino" | "femenino";
    age: number;
    height: number; // en cm
    weight: number; // en kg
    activity: "sedentaria" | "moderada" | "muy_activa";
  }
  
  const calculateCalories = ({ gender, age, height, weight, activity }: UserData): number => {
    let tmb: number;
  
    // Calcular TMB según el género
    if (gender === "masculino") {
      tmb = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      tmb = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  
    // Ajustar el TMB según el nivel de actividad
    let activityFactor: number;
  
    switch (activity) {
      case "sedentaria":
        activityFactor = 1.2;
        break;
      case "moderada":
        activityFactor = 1.55;
        break;
      case "muy_activa":
        activityFactor = 1.9;
        break;
      default:
        activityFactor = 1.2;
        break;
    }
  
    // Calcular las calorías totales
    const totalCalories = tmb * activityFactor;
  
    return Math.round(totalCalories); // Redondeamos el valor para obtener un número entero
  };
  
  export default calculateCalories;
  