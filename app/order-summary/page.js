import CustomerLayout from "../../client/src/layouts/CustomerLayout";
import OrderSummary from "../../client/src/pages/customer/OrderSummary";

export const metadata = {
  title: "Order Summary",
  description: "Review and confirm your order.",
};

export default function OrderSummaryPage() {
  return (
    <CustomerLayout>
      <OrderSummary />
    </CustomerLayout>
  );
}
