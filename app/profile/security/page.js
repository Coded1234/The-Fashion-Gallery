"use client";
import CustomerLayout from "../../../client/src/layouts/CustomerLayout";
import ProtectedRoute from "../../../client/src/components/ProtectedRoute";
import ProfileSecurity from "../../../client/src/pages/customer/ProfileSecurity";

export default function ProfileSecurityPage() {
  return (
    <CustomerLayout>
      <ProtectedRoute>
        <ProfileSecurity />
      </ProtectedRoute>
    </CustomerLayout>
  );
}
