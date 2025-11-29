import { Output, Services } from "~templates-utils";
import { Input } from "./meta";

export function generate(input: Input): Output {
  const services: Services = [];

  services.push({
    type: "app",
    data: {
      serviceName: input.appServiceName,
      source: {
        type: "image",
        image: input.appServiceImage,
      },
      domains: [
        {
          host: "$(EASYPANEL_DOMAIN)",
          port: 80,
        },
      ],
      mounts: [
        {
          type: "volume",
          name: "data",
          mountPath: "/var/www/baikal",
        },
      ],
            // ----- NEW: environment block with MSMTPRC -----
      environment: {
        MSMTPRC: `defaults
          auth           on
          tls            on
          tls_trust_file /etc/ssl/certs/ca-certificates.crt
          account        default
          host           smtp.protonmail.ch
          port           587
          from           baikal@example.com
          user           <user>
          password       <password>`
      }
    },
  });

  return { services };
}
