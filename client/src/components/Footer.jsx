export default function Footer() {
  return (
    <footer className="w-full fixed bottom-3 left-0 bg-white py-3 flex items-center justify-center">
      <p className="text text-sm font-poppins tracking-normal">
        © {new Date().getFullYear()} XCropAi. All rights reserved.
      </p>
    </footer>
  );
}
