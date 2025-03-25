import QR from "../components/qr";

export default function Home() {

  return (
    <div className="flex flex-col items-center mx-auto max-w-7xl space-y-8">
      <QR/>
      <p className="text-3xl font-medium">Scan QR Code with scouting app</p>
    </div>
  );
}
