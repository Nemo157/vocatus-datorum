require_relative 'entity'

module Vocatus
  module Datorum
    class Recipe
      include Entity

      property :cocktail_id, Integer, unique_index: :cocktail_name
      property :name, String, required: true, unique_index: :cocktail_name
      property :description, Text

      has n, :ingredients, 'QuantifiedIngredient'
      belongs_to :cocktail

      validates_uniqueness_of :name, scope: :cocktail
    end

    require_relative 'quantified_ingredient'
    require_relative 'cocktail'
  end
end
