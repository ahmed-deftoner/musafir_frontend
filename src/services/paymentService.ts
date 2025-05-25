import axios from "axios";
import {
  ICreatePayment,
  IPayment,
  IRequestRefund,
  IRefund,
} from "./types/payment";

export class PaymentService {
  static async getBankAccounts() {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/get-bank-accounts`
    );
    return data;
  }

  static async createBankAccount(bankAccount: any) {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/create-bank-account`,
      bankAccount
    );
    return data;
  }

  static async requestRefund(refund: IRequestRefund) {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/refund`,
      refund
    );
    return data;
  }

  static async createPayment(payment: ICreatePayment) {
    try {
      const formData = new FormData();
      formData.append("registration", payment.registration);
      formData.append("bankAccount", payment.bankAccount);
      formData.append("paymentType", payment.paymentType);
      formData.append("amount", payment.amount.toString());
      formData.append("screenshot", payment.screenshot);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/create-payment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          throw new Error(
            error.response.data.message || "Failed to create payment"
          );
        } else if (error.request) {
          // Request made but no response received
          throw new Error("No response received from server");
        }
      }
      // Generic error handling
      // throw new Error('Failed to create payment: ' + error.message);
    }
  }

  static async approvePayment(paymentId: string) {
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/approve-payment/${paymentId}`
    );
    return data;
  }

  static async rejectPayment(paymentId: string) {
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/reject-payment/${paymentId}`
    );
    return data;
  }

  static async getPendingPayments(): Promise<IPayment[]> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/get-pending-payments`
    );
    return data;
  }

  static async getCompletedPayments(): Promise<IPayment[]> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/get-completed-payments`
    );
    return data;
  }

  static async getPayment(id: string): Promise<IPayment> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/get-payment/${id}`
    );
    return data;
  }

  static async getRefunds(): Promise<IRefund[]> {
    try {
      const { data } = await axios.get<IRefund[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/get-refunds`
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            error.response.data.message || "Failed to fetch refunds"
          );
        } else if (error.request) {
          throw new Error("No response received from server");
        }
      }
      throw new Error("Failed to fetch refunds");
    }
  }

  static async approveRefund(id: string): Promise<void> {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/approve-refund/${id}`
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            error.response.data.message || "Failed to approve refund"
          );
        } else if (error.request) {
          throw new Error("No response received from server");
        }
      }
      throw new Error("Failed to approve refund");
    }
  }

  static async rejectRefund(id: string): Promise<void> {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/reject-refund/${id}`
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            error.response.data.message || "Failed to reject refund"
          );
        } else if (error.request) {
          throw new Error("No response received from server");
        }
      }
      throw new Error("Failed to reject refund");
    }
  }
}
