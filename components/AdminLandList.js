import Link from 'next/link';
import React from 'react'
import RemoveButton from './RemoveButton';
const getLand=async()=>{
  try {
    const res=await fetch('http://localhost:3000/api/land',{cache:"no-store"});
    if (!res.ok){throw new Error("Failed to fetch land");}
    return res.json()
  } catch (error) {
    console.log(error)
  }
}
 export default async function AdminLandList(){
  const {lands}=await getLand();
  return (
    <div>
        <table>
        <thead>
            <tr>
  
                <th>land name</th>
                <th>max stock</th>
                <th>min stock</th>
                <th>per stock price</th>
                <th>ranking</th>
                <th>profit or loss rate</th>
               
            </tr>
            </thead>
            <tbody>
            
              
{lands.map ( (land) => 
            
(             
  <tr> <td>{land.landName}</td>
  
              <td>{land.totalStock}</td>
              <td>{land.minimumStock}</td>
              <td>{land.perStockPrice}</td>
              <td>{land.ranking}</td>
              <td>{land.profitLossPercentage}</td>
              <td><Link href={`/editLand/${land._id}`}>Edit</Link></td>
              <td><RemoveButton id={land._id}/></td>
              </tr>))}
              
            
            </tbody>
            
        </table>
    </div>
  )
}

