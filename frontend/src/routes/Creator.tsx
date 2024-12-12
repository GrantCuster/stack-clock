import { useParams, useNavigate, Outlet } from "react-router";
import { Select } from "../components/Select";
import { labels } from "../shared/consts";
import { Button, ButtonLink } from "../components/Button";
import {
  CameraIcon,
  LayoutGridIcon,
  MonitorIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { getTargetDimensions } from "../shared/utils";
import useResizeObserver from "use-resize-observer";
import { growContainerSizeAtom } from "../atoms";
import { useAtom } from "jotai";

export function Creator() {
  const { digit } = useParams();
  const navigate = useNavigate();
  const [, setGrowContainer] = useAtom(growContainerSizeAtom);
  const { ref: growRef } = useResizeObserver({
    onResize: ({ width, height }) => {
      if (width && height) {
        setGrowContainer({ width, height });
      }
    },
  });

  return (
    <div className="absolute left-0 top-0 w-full h-full flex flex-col overflow-hidden">
      <div className="flex gap-2 items-center py-2 bg-neutral-800 px-2 justify-between">
        <div className="px-2">Create</div>
        <Select
          value={digit}
          onChange={(e) => {
            navigate(`/creator/${e.target.value}`);
          }}
        >
          {labels.map((label, i) => (
            <option key={i} value={label}>
              {label}
            </option>
          ))}
        </Select>
        <div className="flex gap-2 items-center">
          <ButtonLink transparent to={`/chooser`}>
            <LayoutGridIcon size={16} />
          </ButtonLink>
          <ButtonLink to="/">
            <XIcon size={16} />
          </ButtonLink>
        </div>
      </div>
      <div ref={growRef} className="grow bg-black relative overflow-hidden">
        <TargetVisualizer />
        <Outlet />
      </div>
      <div className="flex h-14 gap-2 items-center py-2 bg-neutral-800 px-2 justify-between"></div>
    </div>
  );
}

export function MethodChoice() {
  const { digit } = useParams();
  return (
    <div className="absolute left-0 top-0 w-full h-full flex flex-col gap-2 items-center justify-center">
      <div className="mb-1">Method</div>
      <ButtonLink
        to={`/creator/${digit}/camera`}
        // onClick={() => {
        //   setCameraModeOn(true);
        //   navigator.mediaDevices
        //     .getUserMedia({ video: true })
        //     .then((stream) => {
        //       setStream(stream);
        //     });
        // }}
      >
        <CameraIcon size={16} />
        Camera
      </ButtonLink>
      <Button>
        <UploadIcon size={16} />
        Upload
      </Button>
      <Button>
        <MonitorIcon size={16} />
        Screenshare
      </Button>
    </div>
  );
}

export function CreatorCamera() {
  return (
    <div className="absolute left-0 top-0 w-full h-full flex flex-col gap-2 items-center justify-center">
      <div className="mb-1">Camera</div>
      <Button>
        <CameraIcon size={16} />
        Take Picture
      </Button>
    </div>
  );
}

function TargetVisualizer() {
  const { digit } = useParams();
  const { targetWidth, targetHeight } = getTargetDimensions(digit!);
  const [growContainerSize] = useAtom(growContainerSizeAtom);

  const padding = 24;
  const scale = Math.min(
    Math.min(
      (growContainerSize.width - padding * 2) / targetWidth,
      (growContainerSize.height - padding * 2) / targetHeight,
    ),
    1,
  );

  console.log(growContainerSize);
  console.log(scale);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "100%",
        height: "100%",
        transformOrigin: "0 0",
        transform: `scale(${scale}) translate(-50%, -50%)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="absolute">
        <div
          className="border-blue-500 relative border-2 m-auto"
          style={{
            width: targetWidth,
            height: targetHeight,
          }}
        ></div>
      </div>
    </div>
  );
}
