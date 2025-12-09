export default function Footer() {
  return (
    <footer className="w-full absolute bottom-0 left-0 bg-transparent py-6 flex items-center justify-center">
      <p className="text text-sm font-poppins tracking-normal">
        © {new Date().getFullYear()} XCropAI. All rights reserved.
      </p>
    </footer>
  );
}
