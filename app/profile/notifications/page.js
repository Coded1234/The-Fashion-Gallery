"use client";
import CustomerLayout from "../../../client/src/layouts/CustomerLayout";
import ProtectedRoute from "../../../client/src/components/ProtectedRoute";
import ProfileNotifications from "../../../client/src/pages/customer/ProfileNotifications";

export default function ProfileNotificationsPage() {
  return (
    <CustomerLayout>
      <ProtectedRoute>
        <ProfileNotifications />
      </ProtectedRoute>
    </CustomerLayout>
  );
}
