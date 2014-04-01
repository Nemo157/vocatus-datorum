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

          belongs_to :created_by, User, child_key: :created_by_id
          belongs_to :updated_by, User, child_key: :updated_by_id
          belongs_to :deleted_by, User, child_key: :deleted_by_id

          before :save, :set_update_user
          before :destroy, :set_delete_user

          validates_with_method :verify_user_rights, when: [:create, :update, :destroy]

          before :valid? do |context=:default|
            @validation_context = context
          end
        end
      end

      def set_update_user
        if User.current
          if new? && created_by.nil?
            self.created_by = User.current
          end
          self.updated_by = User.current
        else
        end
      end

      def set_delete_user
        if User.current
          self.deleted_by = User.current
        end
      end

      def verify_user_rights
        if User.current and User.current.can @validation_context, self
          true
        else
          [ false, "You do not have rights to #{@validation_context} this entity" ]
        end
      end
    end
  end
end
