module Vocatus
  module Datorum
    require_relative 'api/user'
    class User
      def superuser?
        options.include? :superuser
      end

      def can right, entity
        superuser? or
          (entity.respond_to?(:"can_be_#{right}ed_by") and
          entity.send(:"can_be_#{right}ed_by", self))
      end
    end
  end
end

