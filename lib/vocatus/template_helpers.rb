require 'vocatus/routes'

module Vocatus
  module Datorum
    module TemplateHelpers
      def map_template template
        current = Routes
        template.to_s.split('/').each do |part|
          next unless part.length > 0
          current = current.is_a?(Hash) ? (current[part] || current.select { |key, value| key.start_with? ':' }.first.last) : nil
        end
        (current.is_a?(String) && current) || (current.is_a?(Hash) && current['']) || template
      end

      def render_template template
        if settings.production?
          slim template.to_sym rescue slim :missing
        else
          slim template.to_sym
        end
      end
    end
  end
end
