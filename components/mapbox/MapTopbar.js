import React, { useState } from "react";
import { Select, Button, Input, Slider, Modal } from "antd";
const { Option } = Select;
import { BsChevronBarDown, BsChevronDown, BsSearch } from "react-icons/bs";
import { useRouter } from "next/router";
const MapTopbar = ({
  
  handleSearch,
  
}) => {
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000000);
  const Router=useRouter()
  // Format the min and max prices for display
  const formattedMinPrice =
    minPrice < 1000000
      ? `$${(minPrice / 1000).toFixed(0)}k`
      : `$${(minPrice / 1000000).toFixed(1)}m`;

  const formattedMaxPrice =
    maxPrice < 1000000
      ? `$${(maxPrice / 1000).toFixed(0)}k`
      : `$${(maxPrice / 1000000).toFixed(1)}m`;
  
  const handleOpenPriceModal = () => {
    setIsPriceModalVisible(true);
  };

  const handleClosePriceModal = () => {
    setIsPriceModalVisible(false);
  };

  const handleFilterChange = (value) => {
    console.log(value);
  };

  const handleMinMaxFilter = (min, max) => {
    console.log(min, max);
  };

   const handleSliderChange = (values) => {
     const [min, max] = values;
     console.log(`Selected range: ${min} - ${max}`);
   };
   
  return (
    // Format the min and max prices for display

    <>
      <div className="flex justify-between flex-wrap  items-center p-2 my-2 mx-2 md:mx-4 rounded-md">
        <div className="mr-4 flex my-2 flex-wrap justify-between items-center">
          <div className="mx-2 my-1">
            <Select
              defaultValue="Home Type"
              style={{ width: 120 }}
              onChange={handleFilterChange}
            >
              <Option value="apartment">Apartment</Option>
              <Option value="apartment">Duplex</Option>
              <Option value="house">House</Option>
              <Option value="condo">Condo</Option>
              <Option value="townhouse">Townhouse</Option>
              <Option value="villa">Villa</Option>
              <Option value="cottage">Cottage</Option>
            </Select>
          </div>
          <div className="mx-2 my-1">
            <Select
              defaultValue="Phase"
              style={{ width: 120 }}
              onChange={handleFilterChange}
            >
              <Option value="pre-construction">Pre-Construction</Option>
              <Option value="construction">Construction</Option>
              <Option value="post-construction">Post-Construction</Option>
              <Option value="completed">Completed</Option>
              <Option value="planning">Planning</Option>
            </Select>
          </div>
          <div className="mx-2 my-1">
            <Select
              defaultValue="Builder"
              style={{ width: 120 }}
              onChange={handleFilterChange}
            >
              <Option value="individual">Individual</Option>
              <Option value="company">Company</Option>
              <Option value="contractor">Contractor</Option>
              <Option value="developer">Developer</Option>
              <Option value="architect">Architect</Option>
            </Select>
          </div>
          <div className="mx-2 my-1">
            <Select
              defaultValue="Status"
              style={{ width: 120 }}
              onChange={handleFilterChange}
            >
              <Option value="available">Available</Option>
              <Option value="booked">Booked</Option>
              <Option value="sold">Sold</Option>
              <Option value="underConstruction">Under Construction</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </div>

          <div className="flex items-center mx-2 my-2">
            <Button onClick={handleOpenPriceModal} value={"Select Price Range"}>
              Select Price Range
              <BsChevronDown className="inline mx-2" />
            </Button>
          </div>
          <Modal
            title="Set Price Range"
            visible={isPriceModalVisible}
            onOk={handleClosePriceModal}
            onCancel={handleClosePriceModal}
            okButtonProps={{ style: { backgroundColor: "black", color: "white" } }}
          >
            <div className="flex justify-between items-center mb-4 ">
              <Input
                value={formattedMinPrice}
                className="border rounded-sm border-gray-900 p-4 w-1/2 mx-2"
              />
              <Input
                value={formattedMaxPrice}
                className="border rounded-sm border-gray-900 p-4 w-1/2 mx-2"
              />
            </div>
            <Slider
              range
              value={[minPrice, maxPrice]} // Set the slider values to minPrice and maxPrice
              min={0}
              max={3000000} // Adjust the max value to 3 million
              step={10000} // Adjust the step as needed
              onChange={(values) => {
                setMinPrice(values[0]);
                setMaxPrice(values[1]);
                handleSliderChange(values); // Pass the updated values to your handleSliderChange function
              }}
            />
            <div className="flex justify-between">
              <span>{formattedMinPrice}</span>
              <span>{formattedMaxPrice}</span>
            </div>
          </Modal>
        </div>
        <div className="mx-2 flex items-center flex-col md:flex-row">
          <Button
            type="button"
            onClick={() => Router.push("/")}
            className="bg-white text-gray-950 p-2 h-full  border-2 border-gray-950 rounded-md"
          >
            Map View
          </Button>
          <Button
            type="button"
            onClick={() => Router.push("/home/tilt_view")}
            className="custom-btn mx-2 my-2 md:my-0 h-full"
          >
            Tile View
          </Button>
          <Input.Search
            icon={<BsSearch />}
            onSearch={handleSearch} // Use the handleSearch function here
            placeholder="Search: (Address,Builder,Package)"
          />
        </div>
      </div>
    </>
  );
};

export default MapTopbar;