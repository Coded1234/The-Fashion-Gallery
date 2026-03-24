import CustomerLayout from "../../client/src/layouts/CustomerLayout";
import Checkout from "../../client/src/pages/customer/Checkout";

export const metadata = {
  title: "Checkout",
  description: "Complete your purchase at Diamond Aura Gallery.",
};

export default function CheckoutPage() {
  return (
    <CustomerLayout>
      <Checkout />
    </CustomerLayout>
  );
}
