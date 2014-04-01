require_relative 'base_entity'

module Vocatus
  module Datorum
    class User
      include BaseEntity

      property :id, Serial, writer: :protected, min: 0

      property :email, String, required: true, unique: true

      property :options, Flag[ :superuser ]

      has n, :user_sessions
    end

    require_relative 'user_session'
  end
end

