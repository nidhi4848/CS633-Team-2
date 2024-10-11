import { getAllItems } from '../util/nutritionix-api-search-all.js';
import { getOneItem } from '../util/nutritionix-api-search-one.js';




/*****************************************Search All Items  *****************************************************/
export async function searchAllItems(req, res) {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const allItems = await getAllItems(query);
    
    // Check if the response is an array
    if (!Array.isArray(allItems)) {
        return res.status(500).json({ error: 'Unexpected response format' });
      }
  
      // Transform the data for each food item in the response
      const transformedData = allItems.map(item => ({
        name: item.food_name,
        serving_quantity: item.serving_qty,
        serving_unit: item.serving_unit,
        image: item.photo?.thumb || 'No image available',
        tag_name: item.tag_name,
        locale: item.locale,
        // You can include more fields as necessary
      }));

    res.json(transformedData);
  } catch (error) {
    console.error('Error searching for item:', error);
    res.status(500).json({ error: 'Failed to search for item' });
  }
}


/****************************************************Search Details One Item********************************************************/
/*****************************************Search All Items  *****************************************************/
export async function searchOneItem(req, res) {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
      }
  
      const allItems = await getOneItem(query);
      
    // Transform the data for each food item in the response, rename fields, and remove full_nutrients
    const transformedData = allItems.map(item => ({
        foodName: item.food_name,
        brandName: item.brand_name,
        servingQuantity: item.serving_qty,
        servingUnit: item.serving_unit,
        servingWeightGrams: item.serving_weight_grams,
        calories: item.nf_calories,
        totalFat: item.nf_total_fat,
        saturatedFat: item.nf_saturated_fat,
        cholesterol: item.nf_cholesterol,
        sodium: item.nf_sodium,
        totalCarbohydrates: item.nf_total_carbohydrate,
        dietaryFiber: item.nf_dietary_fiber,
        sugars: item.nf_sugars,
        protein: item.nf_protein,
        potassium: item.nf_potassium,
        phosphorus: item.nf_p,
        image: item.photo?.thumb || 'No image available',
        consumedAt: item.consumed_at,
        mealType: item.meal_type,
        altMeasures: item.alt_measures,
        tags: item.tags,
        metadata: item.metadata,
        source: item.source
        // Other fields you may want to include
      }));
  
      res.json(transformedData);
    } catch (error) {
      console.error('Error searching for item:', error);
      res.status(500).json({ error: 'Failed to search for item' });
    }
  }