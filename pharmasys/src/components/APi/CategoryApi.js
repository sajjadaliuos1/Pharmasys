import { BASE_URL  } from './Helper.js';
import axios from "axios";

///////get categories from api///////
export const CategoriesDetails  = async () => {
    const response =  await axios.get(`${BASE_URL}/Setting/categories`);
    return response;
  };
  