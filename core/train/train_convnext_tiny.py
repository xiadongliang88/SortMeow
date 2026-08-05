import os
import torch
from core.nets.convnext_tiny import pytorch_convnext_tiny
from core.dataloader.dataloader import train_dataloader
from core.const import epoch, lr, batch_size


def train():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print("device: ", device)

    net = pytorch_convnext_tiny().to(device)

    loss_func = torch.nn.CrossEntropyLoss()

    optimizer = torch.optim.Adam(net.parameters(), lr=lr)

    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=20, eta_min=1e-6)

    for e in range(epoch):
        print("epoch: ", e)
        net.train()

        for i, data in enumerate(train_dataloader):
            inputs, labels = data
            inputs, labels = inputs.to(device), labels.to(device)

            outputs = net(inputs)

            loss = loss_func(outputs, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            _, pred = torch.max(outputs, dim=1)
            correct = pred.eq(labels.data).cpu().sum()

            print("step: ", i, "loss: ", loss.item(), "correct: ", 1.0 * correct / batch_size)

        scheduler.step()
        print("lr: ", optimizer.state_dict()['param_groups'][0]['lr'])

        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_dir = os.path.join(script_dir, "..", "models")
        if not os.path.exists(model_dir):
            os.makedirs(model_dir)

        torch.save(net.state_dict(), os.path.join(model_dir, "convnext_tiny_epoch_{}.pth".format(e + 1)))


if __name__ == "__main__":
    train()
