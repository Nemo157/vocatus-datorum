require 'gipan'
require 'abstract'
require 'vocatus/entity'
require 'securerandom'

module Vocatus
  module Datorum
    class User
      include BaseEntity

      property :email, String, required: true, unique: true

      has n, :user_sessions

      class << self
        attr_accessor :current_user
      end
    end

    class UserSession
      include BaseEntity

      property :client_id, UUID, writer: :protected, required: true, default: -> { SecureRandom.uuid }

      belongs_to :user
    end

    Entity.user_class = User

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

      resource User
      resource UserSession

      enable :logging

      configure :development do
        puts 'Simulating really slow connection/Api'
        before do
          sleep 1
        end
      end
    end
  end
end
