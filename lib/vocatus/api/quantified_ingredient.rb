require_relative 'entity'

module Vocatus
  module Datorum
    class QuantifiedIngredient
      include Entity

      property :quantity, Integer, required: true

      belongs_to :recipe
      belongs_to :ingredient
    end

    require_relative 'recipe'
    require_relative 'ingredient'
  end
end
