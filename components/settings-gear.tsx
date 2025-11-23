import { SettingsGearClient } from "@/components/settings-gear-client";
import { AuthButton } from "@/components/auth-button";

export async function SettingsGear() {
  return (
    <SettingsGearClient>
      <AuthButton />
    </SettingsGearClient>
  );
}
