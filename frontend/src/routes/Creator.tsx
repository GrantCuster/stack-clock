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
import {
  cameraAtom,
  cameraStreamAtom,
  canvasContainerAtom,
  creatorCameraVideoElementAtom,
  growContainerSizeAtom,
  mediaSizeAtom,
  selectedDigitAtom,
} from "../atoms";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { panCamera, zoomCamera } from "../shared/camera";

export function Creator() {
  const { digit } = useParams();
  const navigate = useNavigate();

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
          <ButtonLink to="/">
            <XIcon size={16} />
          </ButtonLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export function MethodChoice() {
  const [digit] = useAtom(selectedDigitAtom);
  const [, setGrowContainer] = useAtom(growContainerSizeAtom);
  const { ref: growRef } = useResizeObserver({
    onResize: ({ width, height }) => {
      if (width && height) {
        setGrowContainer({ width, height });
      }
    },
  });

  return (
    <>
      <div ref={growRef} className="grow bg-black relative overflow-hidden">
        <TargetVisualizer />
        <div className="absolute left-0 top-0 w-full h-full flex flex-col gap-2 items-center justify-center">
          <div className="mb-1">Method</div>
          <ButtonLink to={`/creator/${digit}/camera`}>
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
      </div>
      <div className="flex h-16 gap-2 items-center py-2 bg-neutral-800 px-2 justify-between"></div>
    </>
  );
}

export function CreatorCamera() {
  const [digit] = useAtom(selectedDigitAtom);
  const [stream] = useAtom(cameraStreamAtom);
  const [camera, setCamera] = useAtom(cameraAtom);
  const setStream = useSetAtom(cameraStreamAtom);
  const [canvasContainer, setCanvasContainer] = useAtom(canvasContainerAtom);
  const [, setGrowContainer] = useAtom(growContainerSizeAtom);
  const { ref: growRef } = useResizeObserver({
    onResize: ({ width, height }) => {
      if (width && height) {
        setGrowContainer({ width, height });
      }
    },
  });
  const [mediaSize] = useAtom(mediaSizeAtom);
  const { targetWidth, targetHeight } = getTargetDimensions(digit!);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      setStream(stream);
    });
    return () => {
      // TODO stop stream
    };
  }, []);

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      if (canvasContainer) {
        event.preventDefault();

        const { clientX: x, clientY: y, deltaX, deltaY, ctrlKey } = event;

        if (ctrlKey) {
          setCamera((camera) =>
            zoomCamera(camera, { x, y }, deltaY / 400, canvasContainer),
          );
        } else {
          if (event.shiftKey) {
            setCamera((camera) => panCamera(camera, deltaY, 0));
          } else {
            setCamera((camera) => panCamera(camera, deltaX, deltaY));
          }
        }
      }
    }
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [canvasContainer, setCanvasContainer]);

  return (
    <>
      <div ref={growRef} className="grow bg-black relative overflow-hidden">
        <div
          ref={(div) => {
            if (div) {
              setCanvasContainer(div);
            }
          }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "100%",
            height: "100%",
            transformOrigin: "0 0",
            transform: `scale(${camera.z}) translate(-50%, -50%) translate(${camera.x}px, ${camera.y}px)`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {stream ? <CameraStream /> : null}
        </div>
        <TargetVisualizer />
        <div className="absolute left-0 top-0 w-full h-full flex flex-col gap-2 items-center justify-center"></div>
      </div>
      <div className="flex bg-neutral-700 justify-between text-xs px-3 font-mono py-1">
        <div>
          {mediaSize.width}x{mediaSize.height}
        </div>
        <div className="text-blue-400">
          {targetWidth}x{targetHeight}
        </div>
        <div>
          {Math.round(camera.x)} {Math.round(camera.y)} {camera.z.toFixed(2)}
        </div>
      </div>
      <div className="flex h-16 gap-2 items-center py-2 bg-neutral-800 px-2 justify-center">
        <Button>
          <CameraIcon size={16} />
          Capture
        </Button>
        <ButtonLink to={`/creator/${digit}`} transparent={true}>
          Cancel
        </ButtonLink>
      </div>
    </>
  );
}

export function CameraStream() {
  const [stream] = useAtom(cameraStreamAtom);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaSize, setMediaSize] = useAtom(mediaSizeAtom);
  const [cameraVideoElement, setCameraVideoElement] = useAtom(
    creatorCameraVideoElementAtom,
  );

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          setMediaSize({
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
          });
        }
      };
    }
  }, [stream]);

  return stream ? (
    <video
      className="relative opacity-0"
      ref={(el) => {
        videoRef.current = el;
        if (el && !cameraVideoElement) {
          setCameraVideoElement(el);
        }
      }}
      autoPlay
      playsInline
      style={{
        transform: "scaleX(-1)",
        width: mediaSize.width,
        height: mediaSize.height,
      }}
    />
  ) : null;
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
