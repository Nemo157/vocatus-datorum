require 'gipan'

module Vocatus
  module Datorum
    module Entity
      def self.included entity
        entity.class_eval do
          include GipAN::Resource

          property :id, entity::Serial, writer: :protected
          property :created_at, DateTime, writer: :protected
          property :updated_at, DateTime, writer: :protected
          property :deleted_at, entity::ParanoidDateTime, reader: :protected, writer: :protected
        end
        super
      end
    end
  end
end
