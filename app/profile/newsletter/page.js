"use client";
import CustomerLayout from "../../../client/src/layouts/CustomerLayout";
import ProtectedRoute from "../../../client/src/components/ProtectedRoute";
import ProfileNewsletter from "../../../client/src/pages/customer/ProfileNewsletter";

export default function ProfileNewsletterPage() {
  return (
    <CustomerLayout>
      <ProtectedRoute>
        <ProfileNewsletter />
      </ProtectedRoute>
    </CustomerLayout>
  );
}
