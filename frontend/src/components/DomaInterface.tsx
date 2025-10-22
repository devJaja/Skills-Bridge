import React, { useState } from "react";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import * as DomaSDK from "@doma-protocol/orderbook-sdk";

const API_KEY =
  "v1.2cf9b4f6dc65d7375156f09f74968cb69af8dd784c2c87ddc7eb3f6151d23009";

const DomaInterface: React.FC = () => {
  const [domains, setDomains] = useState<any[]>([]);

  const fetchDomains = async () => {
    try {
      console.log("DomaSDK exports:", DomaSDK);

      if (DomaSDK.getOrders) {
        const orders = await DomaSDK.getOrders({
          chainId: sepolia.id,
        });
        setDomains(orders);
        console.log("Fetched Orders:", orders);
      } else {
        console.warn("No getOrders() in SDK. Available keys:", Object.keys(DomaSDK));
      }
    } catch (error) {
      console.error("Error fetching domains/orders:", error);
    }
  };

  return (
    <div>
      <h2>Doma Interface</h2>
      <button onClick={fetchDomains}>Fetch Domains</button>
      <div>
        <h3>Available Domains:</h3>
        <ul>
          {domains.map((domain, index) => (
            <li key={index}>{domain.name || JSON.stringify(domain)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DomaInterface;
