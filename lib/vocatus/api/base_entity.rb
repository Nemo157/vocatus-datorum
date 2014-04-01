require 'gipan'

module Vocatus
  module Datorum
    module BaseEntity
      def self.included entity_class
        entity_class.class_eval do
          include GipAN::Resource

          property :created_at, DateTime, writer: :protected
          property :updated_at, DateTime, writer: :protected
          property :deleted_at, entity_class::ParanoidDateTime, reader: :protected, writer: :protected
        end
      end
    end
  end
end
