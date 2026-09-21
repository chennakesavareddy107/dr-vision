import torch
import torch.nn as nn
import timm


NUM_CLASSES = 5


class HybridDRModel(nn.Module):
    def __init__(self, convnext, swin):
        super().__init__()

        self.convnext = convnext
        self.swin = swin

        self.classifier = nn.Sequential(
            nn.Linear(768 + 1024, 1024),
            nn.ReLU(),
            nn.Dropout(0.3),

            nn.Linear(1024, 512),
            nn.ReLU(),
            nn.Dropout(0.3),

            nn.Linear(512, NUM_CLASSES)
        )

    def forward(self, x):

        conv_feat = self.convnext(x)

        swin_feat = self.swin(x)

        fused = torch.cat(
            [conv_feat, swin_feat],
            dim=1
        )

        return self.classifier(fused)


def create_hybrid_model():

    convnext = timm.create_model(
        "convnextv2_tiny.fcmae_ft_in22k_in1k",
        pretrained=False,
        num_classes=NUM_CLASSES
    )

    convnext.head.fc = nn.Identity()

    swin = timm.create_model(
        "swin_base_patch4_window7_224",
        pretrained=False,
        num_classes=NUM_CLASSES
    )

    swin.head.fc = nn.Identity()

    model = HybridDRModel(
        convnext,
        swin
    )

    return model


def load_model(weights_path, device="cpu"):

    model = create_hybrid_model()

    checkpoint = torch.load(
        weights_path,
        map_location=device
    )

    if isinstance(checkpoint, dict):

        if "model_state_dict" in checkpoint:
            model.load_state_dict(
                checkpoint["model_state_dict"]
            )
        else:
            model.load_state_dict(
                checkpoint
            )

    else:
        model.load_state_dict(
            checkpoint
        )

    model.to(device)
    model.eval()

    return model