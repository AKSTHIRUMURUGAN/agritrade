
"use client";
import { UploadButton } from "../src/utils/uploadthing";
import Image from "next/image";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Land({id,Land}) {
    console.log(id,Land)
    
  const [landImage, setLandImage] = useState(Land.landImage);
  const [landName, setLandName] = useState(Land.landName);
  const [landPlace, setLandPlace] = useState(Land.landPlace);
  const [landDescription, setLandDescription] = useState(Land.landDescription);
  const [totalStock, setTotalStock] = useState(Land.totalStock);
  const [minimumStock, setMinimumStock] = useState(Land.minimumStock);
  const [perStockPrice, setPerStockPrice] = useState(Land.perStockPrice);
  const [minimumStockPrice, setMinimumStockPrice] = useState(Land.minimumStockPrice);
  const [seed, setSeed] = useState(Land.seed);
  const [duration, setDuration] = useState(Land.duration);
  const [profitLossMargin, setProfitLossMargin] = useState(Land.profitLossMargin);
  const [soilTest, setSoilTest] = useState(Land.soilTest);
  const [documentVerified, setDocumentVerified] = useState(Land.documentVerified);
  const [kycVerified, setKycVerified] = useState(Land.kycVerified);
  const [ranking, setRanking] = useState(Land.ranking);
  const [profitLossPercentage, setProfitLossPercentage] = useState(Land.profitLossPercentage);
  const [yearsStayInMarket, setYearsStayInMarket] = useState(Land.yearsStayInMarket);
  const [status, setStatus] = useState(Land.status);
  const[assured,setAssured]=useState(Land.assured);
  const[previousAmount,setPreviousAmount]=useState(Land.previousAmount)
  const[currentAmount,setCurrentAmount]=useState(Land.currentAmount)
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/land/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({landImage,landName,landPlace,landDescription,totalStock,minimumStock,perStockPrice,minimumStockPrice,seed,duration,profitLossMargin,soilTest,documentVerified,kycVerified,ranking,profitLossPercentage,yearsStayInMarket,previousAmount,currentAmount}),
      });

      if (res.status === 200) {
        router.push("/"); // Redirect after successful submission
      } else {
        throw new Error("Failed to create a land entry");
      }
    } catch (error) {
      console.error("Error creating land entry:", error);
    }
  };

  return (
   <>
       <Image
      src={landImage}
      width={500}
      height={500}
      alt="Picture of the author"
    />
    <div>
        <p>Land Name:{landName}</p>
        <p>Land Place:{landPlace}</p>
        <p>Land Description:{landDescription}</p>
        <p>Total stock:{totalStock}</p>
        <p>Minimum Stock:{minimumStock}</p>
        <p>perStockPrice:{perStockPrice}</p>
        <p>Land Place:{landPlace}</p>
        <p>Land Place:{landPlace}</p>
        
    </div>
   </>
);
}
