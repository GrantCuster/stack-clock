import { useParams, useNavigate } from "react-router";
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
          <ButtonLink transparent to={`/chooser`}>
            <LayoutGridIcon size={16} />
          </ButtonLink>

          <ButtonLink to="/">
            <XIcon size={16} />
          </ButtonLink>
        </div>
      </div>
      <div className="bg-black grow flex relative overflow-hidden"></div>
      <div className="flex gap-2 justify-center py-2 pb-4 bg-neutral-800">
        <Button>
          <UploadIcon size={16} />
          Upload
        </Button>
        <Button
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
        </Button>
        <Button>
          <MonitorIcon size={16} />
          Screenshare
        </Button>
      </div>
    </div>
  );
}
