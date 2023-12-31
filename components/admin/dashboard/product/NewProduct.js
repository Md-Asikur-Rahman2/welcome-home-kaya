import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { categories, getSubcategories } from "./categoriesData";
import { BsChevronDown } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearProductErrors,
  createNewProduct,
  resetProductState,
} from "@/redux/actions/productActions";
import { useRouter } from "next/router";
import AddImages from "../../home/add/addImages/AddImages";
import { useValue } from "@/context/ContextProvider";

const { Option } = Select;

const NewProduct = () => {
  const {
    state: { images },
    dispatch:dispatchContext
  } = useValue();
  const router = useRouter();
  const dispatch = useDispatch();
  const { createLoading, isCreated, error } = useSelector((s) => s.product);
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    form.setFieldsValue({ subcategory: null, subSubcategory: null });
  };

  const handleSubcategoryChange = (value) => {
    setSelectedSubcategory(value);
    form.setFieldsValue({ subSubcategory: null });
  };

  const onFinish = (values) => {
    dispatch(createNewProduct({...values,images}));
  };

  useEffect(() => {
    if (isCreated) {
      dispatchContext({ type: "UPDATE_IMAGES", payload: [] })
      
      toast.success("Product Created successfully");
      router.push("/dashboard/products");
      dispatch(resetProductState());
      setTimeout(() => {
        router.reload()
      }, 3000);
    }
    if (error) {
      toast.success(error);
      dispatch(clearProductErrors());
    }
    
  }, [router, dispatch, error, isCreated]);
  return (
    <div className="container mx-auto p-4 m-4">
      <div className="bg-white p-6 rounded shadow-md max-w-lg mx-auto">
        <h2 className="text-3xl text-gray-700 mb-4  text-center">Create New Product</h2>
        <Form
          form={form}
          name="createProduct"
          layout="vertical"
          size="large"
          onFinish={onFinish}
          className="w-full mx-auto"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input
              placeholder="Enter product title"
              className="border border-green-400 p-2"
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input the description!" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter Product description"
              className="border border-green-400 p-2"
            />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input
              type="number"
              min="1"
              placeholder="Enter product price"
              className="border border-green-400 p-2"
            />
          </Form.Item>
          <Form.Item
            label="Discount (%)"
            name="discount"
            rules={[{ required: true, message: "Please input the discount!" }]}
          >
            <Input
              type="number"
              min="1"
              placeholder="Enter discount percentage"
              className="border border-green-400 p-2"
            />
          </Form.Item>
          
          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: "Please input the stock!" }]}
          >
            <Input
              type="number"
              min="1"
              
              placeholder="Enter Product Stock"
              className="border border-green-400 p-2"
            />
          </Form.Item>
          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[{ required: true, message: "Please input the company name!" }]}
          >
            <Input
              placeholder="Enter company name"
              className="border border-green-400 p-2"
            />
          </Form.Item>
          {/* category */}
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select placeholder="Select a category" onChange={handleCategoryChange}>
              {categories.map((category) => (
                <Option key={category.name} value={category.name}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Subcategory"
            name="subcategory"
            rules={[{ required: true, message: "Please select a subcategory!" }]}
          >
            <Select
              placeholder="Select a subcategory"
              className={`${
                form.getFieldValue("category") && "border rounded-lg border-yellow-400"
              }`}
              disabled={!form.getFieldValue("category")}
              onChange={handleSubcategoryChange}
              dropdownRender={(menu) => <div className="">{menu}</div>}
            >
              {selectedCategory &&
                categories
                  .find((category) => category.name === selectedCategory)
                  ?.subcategories.map((subcategory) => (
                    <Option key={subcategory.name} value={subcategory.name}>
                      {subcategory.name}
                    </Option>
                  ))}
            </Select>
          </Form.Item>

          <Form.Item label="Sub-subcategory" name="subSubcategory">
            <Select
              placeholder="Select a sub-subcategory"
              className={`${
                form.getFieldValue("subcategory") && "border rounded-lg border-violet-400"
              }`}
              disabled={!form.getFieldValue("subcategory")}
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  {selectedSubcategory &&
                    categories
                      .find((category) => category.name === selectedCategory)
                      ?.subcategories.find(
                        (subcategory) => subcategory.name === selectedSubcategory
                      )?.subSubcategories?.length > 0 && (
                      <span
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          padding: "8px",
                        }}
                      >
                        <i className="fas fa-chevron-down"></i>
                      </span>
                    )}
                </div>
              )}
            >
              {selectedSubcategory &&
                categories
                  .find((category) => category.name === selectedCategory)
                  ?.subcategories.find(
                    (subcategory) => subcategory.name === selectedSubcategory
                  )
                  ?.subSubcategories?.map((subSubcategory) => (
                    <Option key={subSubcategory} value={subSubcategory}>
                      {subSubcategory}
                    </Option>
                  ))}
            </Select>
          </Form.Item>
          {/* // add image */}
          <AddImages />
          <Form.Item>
            <Button
              loading={createLoading}
              type="primary"
              htmlType="submit"
              className="custom-btn w-full h-full "
            >
              {createLoading ? "Creating..." : "Create Product"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default NewProduct;
