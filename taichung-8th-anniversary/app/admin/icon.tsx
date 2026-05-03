import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

const PATH =
  "M 256,256 C 256,182 206,136 158,136 C 110,136 66,182 66,256 C 66,330 110,376 158,376 C 206,376 256,330 256,256 C 256,182 306,136 354,136 C 402,136 446,182 446,256 C 446,330 402,376 354,376 C 306,376 256,330 256,256";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "#0D1829",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 96,
        }}
      >
        <svg width="512" height="512" viewBox="0 0 512 512" fill="none">
          <path d={PATH} stroke="#3A2000" strokeWidth={72} strokeLinecap="round" fill="none" />
          <path d={PATH} stroke="#7A4E1A" strokeWidth={60} strokeLinecap="round" fill="none" />
          <path d={PATH} stroke="#B8821E" strokeWidth={50} strokeLinecap="round" fill="none" />
          <path d={PATH} stroke="#C9963A" strokeWidth={42} strokeLinecap="round" fill="none" />
          <path d={PATH} stroke="#DEB86A" strokeWidth={30} strokeLinecap="round" fill="none" />
          <path d={PATH} stroke="#EDD090" strokeWidth={16} strokeLinecap="round" fill="none" opacity="0.85" />
          <path d={PATH} stroke="#FFF2CC" strokeWidth={6}  strokeLinecap="round" fill="none" opacity="0.55" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
