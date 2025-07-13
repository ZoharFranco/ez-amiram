import { useAuth } from "@/frontend/contexts/auth-context";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { useState } from "react";
import AuthDialog from "../AuthDialog";

export default function AuthButton() {

    const { user, signOut } = useAuth();
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const { t} = useLanguage();
    
    return (
    <div className="flex justify-center mb-12">
    {user ? (
          <div className="flex items-center gap-4 mt-6">
        <button
          onClick={() => signOut()}
          className="btn btn-outline"
        >
          {t('auth.signOut')}
        </button>
      </div>
    ) : (
      <button
        onClick={() => setIsAuthDialogOpen(true)}
        className="btn btn-primary"
      >
        {t('auth.signIn')}
      </button>
    )}
          <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
  </div>)
}