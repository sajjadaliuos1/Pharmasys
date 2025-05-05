import axios from "axios";
///////get categories from api///////
export const CategoriesDetails  = async () => {
    const response = await axios.get('https://pos.idotsolution.com/api/Setting/categories');
    return response;
  };
  