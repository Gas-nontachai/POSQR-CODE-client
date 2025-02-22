import Image from "next/image";
import { Button, Rating } from "@mui/material";

export default function Home() {
  return (
    <>
      <div className="container mx-auto my-5">
        <h1 className="font-bold text-3xl">Hello GGas!</h1>
        <Button>asd</Button>
        <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
        <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
      </div>

    </>
  );
}
