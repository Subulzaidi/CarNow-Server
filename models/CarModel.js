// Sample CarModel.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connectDB = require("../config/dbconnection");

class CarModel {
  static async getAllCars() {
    try {
      const connection = await connectDB();
      const [rows, fields] = await connection.query("SELECT * FROM cars ");
      return rows;
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  }

  static async getCarById(id) {
    try {
      const connection = await connectDB();
      const [rows, fields] = await connection.query(
        "SELECT * FROM cars WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        throw new Error("Car not found");
      }

      return rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  }

  static async updateCarById(id, data) {
    try {
      const connection = await connectDB();
      const { name, email, contact } = data;

      if (!name || !email || !contact) {
        throw new Error("All fields are mandatory!");
      }

      await connection.query(
        "UPDATE cars SET name = ?, email = ?, contact = ? WHERE id = ?",
        [name, email, contact, id]
      );

      return `Update car rental for ID ${id}`;
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  }

  static async deleteCarById(id) {
    try {
      const connection = await connectDB();
      await connection.query("DELETE FROM cars WHERE id = ?", [id]);
      return `Delete car rental for ID ${id}`;
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  }

  static async rentCar({
    car_ID,
    email,
    end_date,
    Start_date,
    address,
    Cnic,
    LicenseNO,
    total_days,
  }) {
    if (
      !car_ID ||
      !email ||
      !end_date ||
      !Start_date ||
      !address ||
      !Cnic ||
      !LicenseNO ||
      !total_days
    ) {
      throw new Error("All fields are required");
    }

    try {
      const connection = await connectDB();

      // Check if email is already taken
      const [carRows] = await connection.execute(
        "SELECT id, daily_rate FROM cars WHERE id = ?",
        [car_ID]
      );

      if (carRows.length === 0) {
        throw new Error("Car not found");
      }

      const { id: carId, daily_rate } = carRows[0];

      const [userRows] = await connection.execute(
        "SELECT email FROM user WHERE email = ?",
        [email]
      );

      if (userRows.length === 0) {
        throw new Error("User not found");
      }

      // Insert RENTED_CAR into the database using parameterized query
      const [insertResult] = await connection.execute(
        "INSERT INTO RENTED_CAR (car_ID, email, end_date, Start_date, address, Cnic, LicenseNO, total_days) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          carId,
          email,
          end_date,
          Start_date,
          address,
          Cnic,
          LicenseNO,
          total_days,
        ]
      );

      const pricing = daily_rate * total_days;

      // Update RENTED_CAR with pricing information
      const updateRentedCarQuery =
        "UPDATE RENTED_CAR SET price = ? WHERE car_ID = ? AND email = ?";
      await connection.execute(updateRentedCarQuery, [pricing, carId, email]);

      //   const updateCarQuery = "UPDATE cars SET availability = ? WHERE id = ?";
      //   const availabilityValue = 0;
      //   await connection.execute(updateCarQuery, [availabilityValue, carId]);

      return "Details are inserted!";
    } catch (error) {
      console.error("Internal server error", error);
      throw new Error("Internal server error");
    }
  }
  static async makePayment(
    car_ID,
    email,
    end_date,
    Start_date,
    address,
    Cnic,
    LicenseNO,
    total_days
  ) {
    try {
      // Retrieve car details from the database
      const carDetails = await this.getCarById(car_ID);

      // Create a payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateAmount(total_days, carDetails.daily_rate),
        currency: "usd",
        description: `Renting ${carDetails.model} for ${total_days} days`,
        payment_method_types: ["card"],
      });

      // Return the client secret instead of the entire payment intent object
      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      console.error(error);
      throw new Error("Internal Server Error");
    }
  }
}
const calculateAmount = (totalDays, daily_rate) => {
  console.log(totalDays * daily_rate);
  // Simple calculation for the total amount
  return totalDays * daily_rate * 100; // Multiply by 100 to convert to cents (Stripe's currency)
};
module.exports = CarModel;
