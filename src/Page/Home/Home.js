import React, { useContext } from "react";
import HeroSlider from "../../Components/HeroSlider/HeroSlider";
import TopHeaders from "../../Components/Headers/TopHeaders";
import ButtonHeaders from "../../Components/Headers/ButtonHeaders";
import SlideProducts from "../../Components/SlideProducts/SlideProducts";
import PageTransition from "../../Components/Helper/PageTransition";
import ArrowUp from "../../Components/Helper/ArrowUp";
import SearchPage from "../SearchPage/SearchPage";
import ShopByBrand from "../../Components/Design/ShopByBrand";
import TopSaleingProducts from "../../Components/Design/TopSaleingProducts";
import TopCategorySection from "../../Components/Design/TopCategorySection";
export default function Home() {
  return (
    <PageTransition>
      <title>Reda Store - Online Shopping for Electronics & More</title>
      <HeroSlider></HeroSlider>
      <SlideProducts
        path={"product"}
        api={"smartphones"}
        style={{ paddingTop: "10%" }}
        title={"Mobile"}
        dis={
          "Smartwatches that keep you on time, fit, and connected — right from your wrist."
        }
      ></SlideProducts>
      <ShopByBrand></ShopByBrand>
      <SlideProducts
        path={"product"}
        api={"mens-watches"}
        title={"Watches"}
        dis={
          "Smartwatches that keep you on time, fit, and connected — right from your wrist."
        }
      ></SlideProducts>
      <TopSaleingProducts></TopSaleingProducts>
      <SlideProducts
        path={"product"}
        api={"kitchen-accessories"}
        title={"kitchen accessories"}
        dis={
          "Powerful laptops built for work, creativity, and entertainment without limits."
        }
      ></SlideProducts>
      <TopCategorySection></TopCategorySection>
      <SlideProducts
        path={"product"}
        api={"mobile-accessories"}
        title={"Mobile Accessories"}
        dis={
          "Discover reliable and modern vehicles that combine comfort, safety, and performance."
        }
      ></SlideProducts>
      <ArrowUp></ArrowUp>
    </PageTransition>
  );
}
