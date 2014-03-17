require 'gipan'
require 'abstract'
require 'vocatus/entity'

module Vocatus
  module Datorum
    class Ingredient
      include Entity
      include GipAN::Abstract

      property :type, Discriminator, writer: :protected

      property :name, String, required: true, unique: true
      property :image_url, String, length: 0..400
      property :description, Text
    end

    class Spirit < Ingredient
      property :abv, Float
    end

    class Mixer < Ingredient
    end

    class QuantifiedIngredient
      include Entity

      property :quantity, Integer, required: true

      belongs_to :ingredient
      belongs_to :recipe
    end

    class Recipe
      include Entity

      property :cocktail_id, Integer, unique_index: :cocktail_name
      property :name, String, required: true, unique_index: :cocktail_name
      property :description, Text

      has n, :ingredients, QuantifiedIngredient
      belongs_to :cocktail

      validates_uniqueness_of :name, scope: :cocktail
    end

    class Cocktail
      include Entity

      property :name, String, required: true, unique: true
      property :image_url, String, length: 0..400
      property :description, Text

      has n, :recipes
    end

    class Api < GipAN::Api
      resource Cocktail
      resource Recipe
      resource Ingredient
      resource Spirit
      resource Mixer

      enable :logging

      configure :development do
        puts 'Simulating really slow connection/Api'
        before do
          sleep 1
        end
      end

      configure :production do
          require 'newrelic_rpm'
      end
    end
  end
end
