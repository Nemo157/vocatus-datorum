require 'gipan'

require_relative 'base_entity'
require_relative 'user'

module Vocatus
  module Datorum
    module Entity
      def self.included entity_class
        entity_class.class_eval do
          include BaseEntity

          property :id, entity_class::Serial, writer: :protected

          property :created_by_id, Integer, reader: :protected, writer: :protected
          property :updated_by_id, Integer, reader: :protected, writer: :protected
          property :deleted_by_id, Integer, reader: :protected, writer: :protected

          belongs_to :created_by, User, child_key: :created_by_id, writer: :protected
          belongs_to :updated_by, User, child_key: :updated_by_id, writer: :protected
          belongs_to :deleted_by, User, child_key: :deleted_by_id, reader: :protected, writer: :protected

          before :save do |entity|
            current_user = User.current
            if current_user
              if entity.new? && entity.created_by.nil?
                entity.created_by = current_user
              end
              entity.updated_by = current_user
            end
          end

          before :destroy do |entity|
            current_user = User.current
            if current_user
              entity.deleted_by = current_user
            end
          end
        end
      end

      class << self
        attr_accessor :user_class
      end
    end
  end
end
