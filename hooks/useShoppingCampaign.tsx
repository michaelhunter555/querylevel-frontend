import { useCallback, useState } from "react";

import { useSession } from "next-auth/react";

import { Keywords, SalePrice } from "@/types";

interface DemoProduct {
  title: string;
  condition?: string | undefined;
  imageLink: string;
  brand: string;
  salePrice: SalePrice;
  link: string;
}

export const useShoppingCampaign = () => {
  const { data: session } = useSession();
  const [brands, setBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [demoProduct, setDemoProduct] = useState<DemoProduct | null>(null);
  const [countIsLoading, setCountIsLoading] = useState<boolean>(false);
  const [activeProducts, setActiveProducts] = useState<number>(0);
  const [productKeywords, setProductKeywords] = useState<Keywords[] | null>(
    null
  );

  //get all available brands from Google Merchant Center
  const getMerchantsData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/getMerchantsBrandsData?id=${session?.user?._id}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setBrands(data.brands);
      setIsLoading(false);
      return data.brands;
    } catch (err) {
      setIsLoading(false);
      console.log("Merchant Data Error", err);
    }
  }, []);

  //get products for merchant center preview
  const getProductsData = useCallback(async (brand: string) => {
    try {
      setCountIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/getMerchantsProductsData?brand=${brand}&id=${session?.user?._id}`,
        { method: "GET" }
      );
      const data = await response.json();
      setActiveProducts(data.productCount);
      setDemoProduct(data.preview);
      setProductKeywords(data.keywords);
      setCountIsLoading(false);
      return {
        productCount: data.productCount,
        preview: data.preview,
        keywords: data.keywords,
      };
    } catch (err) {
      setCountIsLoading(false);
      console.log(`There was an error on getting products`, err);
    }
  }, []);

  return {
    getMerchantsData,
    getProductsData,
    brands,
    productKeywords,
    demoProduct,
    isLoading,
    countIsLoading,
    activeProducts,
  };
};
