import { SettingsForm } from "@/components/Settings/SettingsForm";

const Settings = () => {
  return (
    <>
      <div className="container flex flex-col gap-4 py-8">
        <h1 className="text-2xl font-bold">Setări</h1>
        <SettingsForm />
      </div>
    </>
  );
};

export default Settings;
