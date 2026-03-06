"use client";
import CustomerLayout from "../../../client/src/layouts/CustomerLayout";
import ProtectedRoute from "../../../client/src/components/ProtectedRoute";
import ProfileInfo from "../../../client/src/pages/customer/ProfileInfo";

export default function ProfileInfoPage() {
  return (
    <CustomerLayout>
      <ProtectedRoute>
        <ProfileInfo />
      </ProtectedRoute>
    </CustomerLayout>
  );
}
