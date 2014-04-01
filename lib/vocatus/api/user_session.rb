require 'securerandom'

require_relative 'base_entity'

module Vocatus
  module Datorum
    class UserSession
      include BaseEntity

      property :id, Serial, writer: :protected, min: 0

      property :client_id, UUID, writer: :protected, required: true, default: -> model, property { SecureRandom.uuid }

      belongs_to :user
    end

    require_relative 'user'
  end
end
