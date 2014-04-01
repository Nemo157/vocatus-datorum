require_relative 'entity'

module Vocatus
  module Datorum
    class Ingredient
      include Entity

      property :name, String, required: true, unique: true
      property :image_url, String, length: 0..400
      property :description, Text
      property :abv, Float
    end

    require_relative 'cocktail'

    class Ingredient
      associated_set :cocktails_used_in, Cocktail do |ingredient|
        Cocktail.all(Cocktail.recipes.ingredients.ingredient.id => ingredient.id)
      end
    end
  end
end
