import Image from "next/image";

export default function Home() {
  return (
    <>
      <div>
        <h1>Welcome to the Home Page</h1>
        <Image src="/path/to/your/image.jpg" alt="Sample Image" width={500} height={300} />
        <p>This is a sample paragraph with some content.</p>
      </div>
    </>
  );
}
